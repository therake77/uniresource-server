import requests

login_url = "http://localhost:3000/api/auth/login"
#so first we are going to get a token
payload = {
    "email" : "admin@admin.com",
    "password" : "admin",
    "roleRequested" : "COLLAB"
}

response = requests.post(login_url,data=payload)
# now we have our token
token = response.text

#We want to test the upload file
'''
file = {
    "file" : open("C:/Users/USER/Downloads/test_file.pdf","rb")
}
upload_url = "http://localhost:3000/api/collab/upload"
newResource = [
    ("name", "ada_pc5"),
    ("type", "Exam"),
    ("publish_date", "2025-12-04"),
    ("course", "Analisis y diseño de algoritmos"),
    ("semester", "5"),
    ("school", "CS"),
    ("description", "solution"),
    ("isDownloadable", "true"),
    ("authors[]", "therake_77")
]

headers = {
    "Authorization": f"Bearer {token}"
}

response = requests.post(upload_url,data=newResource,files = file, headers= headers)

print(response.text)
'''
#now i want to retrieve my requests:
getrequests_url = "http://localhost:3000/api/collab/myrequests"
headers = {
    "Authorization": f"Bearer {token}"
}
response = requests.get(getrequests_url,headers=headers)
print(response.text)