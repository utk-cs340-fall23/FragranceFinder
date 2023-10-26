import asyncio
import pandas as pd
from jomashop import scrape_jomashop
from maxaroma import scrape_maxaroma
import os

# Create data directory if it doesn't exist
#if not os.path.exists(os.path.join(os.getcwd(), 'data')):
#    os.mkdir('data', 0x774)


temp = asyncio.run(scrape_jomashop())
df = pd.read_json(temp, orient="records")
#df.to_json('data/jomashop.json', orient='records')

temp1 = asyncio.run(scrape_maxaroma())
df1 = pd.read_json(temp1, orient="records")
#df1.to_json('data/maxaroma.json', orient='records')

print(df.to_json(orient='records'))
print(df1.to_json(orient='records'))