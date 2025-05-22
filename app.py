from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from pydantic import BaseModel
import xgboost as xgb
import numpy as np
from sklearn.pipeline import make_pipeline
from typing import List, Union
import logging

class websiteInputPreprocessor(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
        
    def transform(self, X):
        # Initialize array to store features
        features = np.zeros((1, 55))  # Match the 67 columns from processed_game
        
        # Process each pass (every 3 elements in input list)
        for i in range(0, len(X), 3):
            idx = i // 3  # Get pass number (0-4)
            start_loc = X[i]
            end_loc = X[i+1]
            outcome = X[i+2]
            
            # Calculate pass features
            pass_angle = np.arctan2(end_loc[1] - start_loc[1], end_loc[0] - start_loc[0])
            pass_length = np.sqrt((end_loc[0] - start_loc[0])**2 + (end_loc[1] - start_loc[1])**2)
            
            # Calculate distances and angles
            start_dist_center = np.sqrt((start_loc[0] - 60)**2 + (start_loc[1] - 40)**2)
            end_dist_center = np.sqrt((end_loc[0] - 60)**2 + (end_loc[1] - 40)**2)
            end_dist_goal = np.sqrt((end_loc[0] - 120)**2 + (end_loc[1] - 40)**2)
            end_angle_goal = np.arctan2(end_loc[1] - 40, end_loc[0] - 120)
            if idx == 0:  # Current pass
                features[0, 0] = outcome
                features[0, 1] = pass_angle
                features[0, 2] = pass_length
                features[0, 3:5] = start_loc
                features[0, 5:7] = end_loc
                features[0, 7] = start_dist_center
                features[0, 8] = end_dist_center
                features[0, 9] = end_dist_goal
                features[0, 10] = end_angle_goal
            else:  # Previous passes
                offset = (idx - 1) * 11 + 11  # Starting index for this previous pass
                features[0, offset] = pass_angle
                features[0, offset+1] = pass_length
                features[0, offset+2:offset+4] = start_loc
                features[0, offset+4:offset+6] = end_loc
                features[0, offset+6] = start_dist_center
                features[0, offset+7] = end_dist_center
                features[0, offset+8] = end_dist_goal
                features[0, offset+9] = end_angle_goal
                features[0, offset+10] = outcome
                
        return features



model = xgb.XGBClassifier()
model.load_model("final_xgb_model.json")

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
    features: List[Union[List[float], int]]

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