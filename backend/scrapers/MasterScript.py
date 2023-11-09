import asyncio
import pandas as pd
from jomashop import scrape_jomashop
from maxaroma import scrape_maxaroma
from fragrancenet import scrape_fragrancenet
from venba import scrape_venba
from aura import scrape_aura
from giftExpress import scrape_giftexpress
import os
import sys

# Create data directory if it doesn't exist
#if not os.path.exists(os.path.join(os.getcwd(), 'data')):
#    os.mkdir('data', 0x774)

scrapers = [
    scrape_jomashop,
    scrape_maxaroma,
    scrape_fragrancenet,
    scrape_venba,
    scrape_aura,
    scrape_giftexpress
]

async def get_data(max_items):
    return await asyncio.gather(
        *[scraper(max_items) for scraper in scrapers]
    )


max_items_per_scraper = 10000
if len(sys.argv) > 1:
    try:
        max_items_per_scraper = int(sys.argv[1])
    except ValueError:
        print(
            f"Invalid integer provided: '{sys.argv[1]}'. Defaulting to {max_items_per_scraper} as max items per scraper"
        )

result = asyncio.run(get_data(max_items_per_scraper))

gdf = pd.concat(list(map(
    lambda data: pd.read_json(data, orient='records'),
    result
)))

gdf.to_json('data/AllRecords.json', orient='records')

print(gdf.to_json(orient='records'))
