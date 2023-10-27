import asyncio
import pandas as pd
from jomashop import scrape_jomashop
from maxaroma import scrape_maxaroma
import os
import sys

# Create data directory if it doesn't exist
#if not os.path.exists(os.path.join(os.getcwd(), 'data')):
#    os.mkdir('data', 0x774)


max_items_per_scraper = 10000
if len(sys.argv) > 1:
    try:
        max_items_per_scraper = int(sys.argv[1])
    except ValueError:
        print(
            f"Invalid integer provided: '{sys.argv[1]}'. Defaulting to {max_items_per_scraper} as max items per scraper"
        )

frames = [
    pd.read_json(asyncio.run(scrape_jomashop(max_items_per_scraper)), orient="records"),
    pd.read_json(asyncio.run(scrape_maxaroma(max_items_per_scraper)), orient="records")
]

gdf = pd.concat(frames)

#gdf.to_json('data/AllRecords.json', orient='records')

print(gdf.to_json(orient='records'))
