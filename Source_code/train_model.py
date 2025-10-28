# train_model.py (concept)
from sentence_transformers import SentenceTransformer
import xgboost as xgb
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from joblib import dump

# Load data: DataFrame with columns 'text' and 'label'
df = pd.read_csv('labeled_mood_data.csv')
embedder = SentenceTransformer('all-mpnet-base-v2')
embeddings = np.vstack(df['text'].map(lambda t: embedder.encode(t)).values)
# simple features
df['length'] = df['text'].str.len()
X = np.hstack([embeddings, df[['length']].values])
y = df['label'].astype(int).values

X_train,X_val,y_train,y_val = train_test_split(X,y,test_size=0.2,random_state=42)
model = xgb.XGBClassifier(n_estimators=200, max_depth=6, use_label_encoder=False, eval_metric='mlogloss')
model.fit(X_train,y_train,eval_set=[(X_val,y_val)])
dump((model, embedder), 'model_bundle.joblib')
