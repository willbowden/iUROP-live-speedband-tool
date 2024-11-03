# Inputs
- LTA API Key
- Collection duration
- Collection frequency
- Which cameras/speedbands

# Outputs
- Downloadable csv

# Notes
- Another team is running vehicle type detection in the cloud, so add a feature to upload a csv file (same format as output), so that vehicles can be detected, returning a new csv file with the processed data.
- CREATE A FIGMA DESIGN FOR FRANCICSO.
- Set maximum duration to 30 mins
- Design collection scripts to allow for errors to prevent failure/crashing if posible.

# Steps
1. Collect data for speedbands.
2. Give me data from (1), then submit to vehicle detection model.
3. Append vehicle detection data to csv and download new version.
