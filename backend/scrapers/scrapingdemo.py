import asyncio
from maxaroma import scrape_maxaroma
from jomashop import scrape_jomashop

async def main():
    await asyncio.gather(
        scrape_jomashop(),
        scrape_maxaroma()
    )

if __name__ == "__main__":
    asyncio.run(main())
