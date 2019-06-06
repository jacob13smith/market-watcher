# README

I tried searching for a free public API to create a personal market security analysis tool based of the book "The Intelligent Investor" by Benjamin Graham.  (If you are into investing and need somewhere to start I highly suggest that book).  I couldn't find any API's that matched my needs so I decided to crawl the web for the info I needed.  Using Yahoo Finance pages and Reuters security summaries, I was able to get the live, accurate fields I needed to analyse Canadian securities without an API.

## Logic

For every stock symbol I have saved on my server in a CSV, i grab their yahoo finance page and convert it into a simple DOM tree, which I search through to find the two numbers I need: "Diluted EPS" and "Book Value per Share".  I multipy them together and multiply that by 22.5 (a magic number with other logic behind it), then square root the result to get the securitiy's [Ben Graham Number](https://www.investopedia.com/terms/g/graham-number.asp). (There's some stuff in there to prevent squaring negatives as well).  Then I grab the security's current selling price from the Reuter's website (because with Yahoo, the price isn't sent with the HTML) and create a discount factor by dividing the price by the Graham number and subtracting it from 1. That gives me a list on the front end to make a table sorted by discount factor of what I believe to be undervalued companies on the market.

## Example

![Example](https://github.com/jacob13smith/market-watcher/blob/master/market-watcher.png)
