import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin, urlparse

# Set of already visited URLs to avoid duplicates
visited_urls = set()

# List to store scraped data in the desired JSON format
data = []

# Counter to track the number of pages scraped
pages_scraped = 0

# Maximum number of pages to scrape
PAGE_LIMIT = 10  # Change this to your desired limit

# Function to scrape a single page
def scrape_page(url, limit):
    global pages_scraped  # To modify the global counter
    
    if url in visited_urls:
        return  # Skip pages that are already visited

    if pages_scraped >= limit:
        return  # Stop scraping when the limit is reached

    print(f"Scraping {url}")
    visited_urls.add(url)  # Mark this URL as visited
    pages_scraped += 1  # Increment the page counter

    # Get the page content
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch {url}: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')

    # Initialize current heading and paragraphs to store content
    current_heading = None
    current_paragraphs = []

    # Iterate over all elements in the body
    for elem in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']):
        if elem.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            # If there's already a heading, save the collected paragraphs
            if current_heading and current_paragraphs:
                data.append({
                    "pattern": current_heading,
                    "response": ' '.join(current_paragraphs)  # Join paragraphs into one string
                })
            # Update current heading and reset paragraphs
            current_heading = elem.text.strip()
            current_paragraphs = []
        elif elem.name == 'p':
            # Add paragraph to the current heading's response
            current_paragraphs.append(elem.text.strip())

    # After the loop, save the last heading and its paragraphs
    if current_heading and current_paragraphs:
        data.append({
            "pattern": current_heading,
            "response": ' '.join(current_paragraphs)
        })

    # Find and follow internal links to scrape other pages
    for link in soup.find_all('a', href=True):
        href = link.get('href')
        full_url = urljoin(url, href)  # Construct the full URL

        # Ensure it's an internal link and not an external or anchor link
        if urlparse(full_url).netloc == urlparse(url).netloc:
            scrape_page(full_url, limit)  # Recursively scrape the linked page

# Starting URL (you can replace this with the website's home page)
start_url = 'https://www.rknec.edu/'

# Start scraping with the set page limit
scrape_page(start_url, PAGE_LIMIT)

# Save the scraped data to a JSON file in pattern-response format
with open('website_data.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

print(f"Scraped {len(visited_urls)} pages and saved data to website_data.json")
