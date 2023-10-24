import asyncio
import pandas as pd
from jomashop import scrape_jomashop
import os

# Create data directory if it doesn't exist
if not os.path.exists(os.path.join(os.getcwd(), 'data')):
    os.mkdir('data', 0x774)


temp = asyncio.run(scrape_jomashop())
df = pd.read_json(temp, orient="columns")
df.to_csv('data/jomashop.csv', index=False)
print(df)