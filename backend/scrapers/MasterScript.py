import asyncio
import pandas as pd
from jomashop import scrape_jomashop

temp = asyncio.run(scrape_jomashop())

df = pd.read_json(temp, orient="columns")

print(df)