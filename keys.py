from selenium import webdriver

# Specify the path to the Chrome WebDriver executable
chrome_driver_path = '/usr/local/bin/chromedriver'

# Create a Chrome WebDriver instance
driver = webdriver.Chrome()

# Open a webpage
driver.get('http://localhost:3000')

# Interact with elements on the webpage
#element = driver.find_element_by_id('')
#element.click()

# Close the browser
driver.quit()


keys = {
    "sol": "",
    "eth": "",
    "brc20": "",
    "bsc": ""
}