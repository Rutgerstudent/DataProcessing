#!/usr/bin/env python
# Name: Rutger van Heijningen
# Student number: 10272224
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # BeautifulSoup
    r = get(TARGET_URL)
    soup = BeautifulSoup(r.content, "html.parser")

    links = soup.find_all("a")

    # for link in links:
    #     print("<a href='%s'>%s</a>" %(link.get("href"), link.text))

    # Scrape data for every category
    title = soup.find_all("h3", {"class": "lister-item-header"})
    ratings = soup.find_all("div", {"class": "inline-block ratings-imdb-rating"})
    genres = soup.find_all("div", {"class": "lister-item-content"})
    actors = soup.find_all("div", {"class": "lister-item-content"})
    runtime = soup.find_all("div", {"class": "lister-item-content"})

    # Empty arrays for every category
    title_array = []
    ratings_array = []
    genres_array = []
    actors_array = []
    runtime_array = []

    # Import the right text in certain array
    for item in title:
        title_array.append(item.contents[3].text)

    for item in ratings:
        ratings_array.append(item.contents[3].text)

    for item in genres:
        genres_array.append(item.contents[3].find_all("span", {"class": "genre"})[0].text.strip('\n'))

    for item in actors:
        actors_array.append(item.contents[9].text.strip().split('\n'))

    for item in runtime:
        runtime_array.append(item.contents[3].find_all("span", {"class": "runtime"})[0].text.strip(' min'))

    # Zip arrays from all categories together into 1 list
    tv_series = list(zip(title_array, ratings_array, genres_array, actors_array, runtime_array))

    return tv_series


def save_csv(outfile, tv_series):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # Import every cell from tv_series in csv file
    for item in tv_series:
        writer.writerow(item)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tv_series = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tv_series)
