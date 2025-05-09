import json

# Load your JSON data
with open(r'rknec_about_us_data.json', 'r') as file:
    data = json.load(file)

# Prepare a list for the structured data
structured_data = []

# Example structure: assuming your data has a specific format
# Modify this part based on the actual structure of your JSON data
for item in data:
    heading = item.get('heading')  # Adjust key for heading
    paragraph = item.get('paragraph')  # Adjust key for paragraph
    
    if heading and paragraph:
        structured_data.append({
            "heading": heading,
            "paragraph": paragraph
        })

# Optionally, save the structured data to a new JSON file
with open('structured_data.json', 'w') as f:
    json.dump(structured_data, f, indent=4)

# Print the structured data to verify
for entry in structured_data:
    print(f"Heading: {entry['heading']}\nParagraph: {entry['paragraph']}\n")
