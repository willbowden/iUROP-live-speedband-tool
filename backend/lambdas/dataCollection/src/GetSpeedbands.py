import requests
import pandas as pd

class BadKeyException(Exception):
    "Raised when API key for LTA is bad or missing"
    pass

def get_camera_images_chunk(lta_key: str, iteration=0) -> pd.DataFrame:
    endpoint = f"https://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2?$skip={iteration}"
    headers = {"AccountKey": lta_key, "accept": "application/json"}

    response = requests.get(endpoint, headers=headers)
    if response.status_code == 400:
        raise BadKeyException
    data = response.json()


    if data:
        return pd.DataFrame(data["value"])

    return []


def get_camera_image_urls(speedbands: pd.DataFrame, lta_key: str) -> pd.DataFrame:
    result = pd.DataFrame(columns=list(speedbands.columns) + ["ImageURL"])

    for _, band in speedbands.iterrows():
        start = 0
        end = 59000
        found = False
        while not found:
            iteration = start + ((end - start) // 2)

            # print(f"Getting chunk using iteration {iteration}")
            chunk = get_camera_images_chunk(lta_key, iteration)

            if len(chunk) == 0:
                break

            search = chunk.loc[chunk["CameraID"] == band["CameraID"]]
            if len(search) > 0:
                search_result = search.iloc[0]

                result.loc[len(result)] = list(band.values) + [search_result["ImageLink"]]

                found = True

            if len(chunk) < 500:
                break

            if int(chunk.iloc[-1]["CameraID"]) < int(band["CameraID"]):
                start = iteration + 500
                # print(f"LESS THAN. Setting start to {start}")
            elif int(chunk.iloc[-1]["CameraID"]) > int(band["CameraID"]):
                end = iteration
                # print(f"GREATER THAN. Setting end to {end}")

    return result


def get_speedband_chunk(lta_key: str, iteration=0) -> pd.DataFrame:
    endpoint = f"http://datamall2.mytransport.sg/ltaodataservice/v3/TrafficSpeedBands?$skip={iteration}"
    headers = {"AccountKey": lta_key, "accept": "application/json"}

    response = requests.get(endpoint, headers=headers)
    if response.status_code == 400:
        raise BadKeyException
    data = response.json()

    if data:
        return pd.DataFrame(data["value"])

    return []


def get_speedband_info(speedbands: list[dict], lta_key: str) -> pd.DataFrame:
    result = pd.DataFrame(
        columns=[
            "CameraID",
            "LinkID",
            "RoadName",
            "SpeedBand",
            "RoadCategory",
            "MinimumSpeed",
            "MaximumSpeed",
            "StartCoords",
            "EndCoords",
        ]
    )

    for band in speedbands:
        start = 0
        end = 59000
        found = False
        while not found:
            iteration = start + ((end - start) // 2)

            # print(f"Getting chunk using iteration {iteration}")
            chunk = get_speedband_chunk(lta_key, iteration)

            if len(chunk) == 0:
                break

            search = chunk.loc[chunk["LinkID"] == band["linkId"]]
            if len(search) > 0:
                search_result = search.iloc[0]
                new_row = {
                    "CameraID": band["cameraId"],
                    "LinkID": band["linkId"],
                    "RoadName": search_result["RoadName"],
                    "SpeedBand": search_result["SpeedBand"],
                    "RoadCategory": search_result["RoadCategory"],
                    "MinimumSpeed": search_result["MinimumSpeed"],
                    "MaximumSpeed": search_result["MaximumSpeed"],
                    "StartCoords": f"{search_result['StartLon']}, {search_result['StartLat']}",
                    "EndCoords": f"{search_result['EndLon']}, {search_result['EndLat']}",
                }

                result.loc[len(result)] = new_row.values()
                found = True

            if len(chunk) < 500:
                break

            if int(chunk.iloc[-1]["LinkID"]) < int(band["linkId"]):
                start = iteration + 500
                # print(f"LESS THAN. Setting start to {start}")
            elif int(chunk.iloc[-1]["LinkID"]) > int(band["linkId"]):
                end = iteration
                # print(f"GREATER THAN. Setting end to {end}")

    return result

def get_speedbands_and_images(speedbands: list[dict], lta_key: str) -> pd.DataFrame:
    sbs = get_speedband_info(speedbands, lta_key)

    with_images = get_camera_image_urls(sbs, lta_key)

    return with_images


# if __name__ == "__main__":
#     res = get_speedband_info(
#         [
#             {
#                 "cameraId": "6710",
#                 "linkId": "103105815",
#             }
#         ],
#         "",
#     )

#     final = get_camera_image_urls(res, "")
