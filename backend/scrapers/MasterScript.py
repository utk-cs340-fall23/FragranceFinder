import asyncio
import pandas as pd
from jomashop import scrape_jomashop
import os

# Create data directory if it doesn't exist
#if not os.path.exists(os.path.join(os.getcwd(), 'data')):
#    os.mkdir('data', 0x774)


temp = asyncio.run(scrape_jomashop())
df = pd.read_json(temp, orient="records")
#df.to_json('data/jomashop.json', orient='records')
print(df.to_json(orient='records'))