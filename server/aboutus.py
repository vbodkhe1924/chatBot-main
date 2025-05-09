import requests
from bs4 import BeautifulSoup
import json

# URL of the specific page to scrape
url = 'https://www.rknec.edu/about-us/'

# Send a request to the webpage
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Create a BeautifulSoup object and parse the HTML
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract relevant data
    title = soup.title.string if soup.title else "No Title"
    headings = [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3'])]
    paragraphs = [p.get_text(strip=True) for p in soup.find_all('p')]
    links = [a['href'] for a in soup.find_all('a', href=True)]

    # Create a dictionary to hold the scraped data
    scraped_data = {
        'url': url,
        'title': title,
        'headings': headings,
        'paragraphs': paragraphs,
        'links': links
    }

    # Save the data to a JSON file
    with open('rknec_about_us_data.json', 'w') as json_file:
        json.dump(scraped_data, json_file, indent=4)

    print("Data successfully saved to rknec_about_us_data.json")

else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")
