from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from pydantic import BaseModel
import xgboost as xgb
import numpy as np
from sklearn.pipeline import make_pipeline
from typing import List, Union


class websiteInputPreprocessor(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
        
    def transform(self, X):
        # Initialize array to store features
        features = []
        
        # Process each pass (every 5 elements in input list)
        for i in range(0, len(X), 7):
            idx = i // 5  # Get pass number (0-4)
            start_loc = X[i:i+2]
            end_loc = X[i+2:i+4]
            outcome = X[i+4]
            
            # Calculate pass features
            pass_angle = np.arctan2(end_loc[1] - start_loc[1], end_loc[0] - start_loc[0])
            pass_length = np.sqrt((end_loc[0] - start_loc[0])**2 + (end_loc[1] - start_loc[1])**2)
            
            # Calculate distances and angles
            start_dist_center = np.abs(start_loc[0] - 40)
            end_dist_center = np.abs(end_loc[0] - 40)
            end_dist_goal = np.sqrt((end_loc[0] - 120)**2 + (end_loc[1] - 40)**2)
            end_angle_goal = np.arctan2(end_loc[1] - 40, end_loc[0] - 120)
            pass_type = X[i+5]
            pass_height = 0 if X[i+6] == "Ground" else 1 if X[i+6] == "Low" else 2
            cross = 1 if pass_type == "Cross" else 0
            throw_in = 1 if pass_type == "Throw-in" else 0
            corner = 1 if pass_type == "Corner" else 0
            free_kick = 1 if pass_type == "Free Kick" else 0
            goal_kick = 1 if pass_type == "Goal Kick" else 0
            cut_back = 1 if pass_type == "Cut-back" else 0
            switch = 1 if pass_type == "Switch" else 0
            through_ball = 1 if pass_type == "Through Ball" else 0

            # Add features in order
            features.extend([
                outcome,
                pass_angle,
                pass_length,
                cross,
                cut_back,
                switch,
                through_ball,
                pass_height,
                start_loc[0],
                start_loc[1],
                end_loc[0],
                end_loc[1],
                start_dist_center,
                end_dist_center,
                end_dist_goal,
                end_angle_goal,
                throw_in,
                corner,
                free_kick,
                goal_kick
            ])
        
        # Pad with zeros if we don't have enough features
        expected_length = 100  # 5 passes * 20 features per pass
        if len(features) < expected_length:
            features.extend([0] * (expected_length - len(features)))
                
        return np.array(features).reshape(1, -1)



model = xgb.XGBClassifier()
model.load_model("final_xgb_modelV2.json")

websitePipeline = make_pipeline(
    websiteInputPreprocessor(),
    model
)

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*",'http://127.0.0.1:5500','http://localhost:5500'],  # Replace with specific domains for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class PredictionRequest(BaseModel):
    features: List[Union[float, str]]

@app.post("/predict")
def predict(request: PredictionRequest):

    try:
        # print("Function called", flush=True)
        input_array = list(request.features)
        print(input_array,flush=True)
        
        return {"prediction": float(websitePipeline.predict_proba(input_array)[0,1])}
    except Exception as e:
        print(f"Error occurred: {e}", flush=True)
        return {"error": str(e)}

#run uvicorn app:app --reload
#to start the api server