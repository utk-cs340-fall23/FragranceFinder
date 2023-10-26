import asyncio
import pandas as pd
from jomashop import scrape_jomashop
from maxaroma import scrape_maxaroma
import os

# Create data directory if it doesn't exist
#if not os.path.exists(os.path.join(os.getcwd(), 'data')):
#    os.mkdir('data', 0x774)

frames = [
    pd.read_json(asyncio.run(scrape_jomashop()), orient="records"),
    pd.read_json(asyncio.run(scrape_maxaroma()), orient="records")
]

#frames[0].to_json('data/jomashop.json', orient='records')
#frames[1].to_json('data/maxaroma.json', orient='records')

gdf = pd.concat(frames)

print(gdf.to_json(orient='records'))
