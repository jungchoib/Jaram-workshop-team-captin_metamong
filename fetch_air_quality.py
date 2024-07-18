import requests
import firebase_admin
from firebase_admin import credentials, db
import time
import geoip2.database


# 파이어베이스 초기화 함수
def initialize_firebase():
    cred = credentials.Certificate('.\dustyzap-7d2b8-firebase-adminsdk-nhwic-09db699379.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://dustyzap-7d2b8-default-rtdb.firebaseio.com/'
    })

# 공인 IP 주소를 가져오는 함수
def get_public_ip():
    try:
        response = requests.get('https://api.ipify.org?format=json')
        ip = response.json()['ip']
        return ip
    except Exception as e:
        print(f"Could not get public IP: {e}")
        return None

# ipinfo.io를 사용하여 IP 주소로부터 위치 정보를 가져오는 함수
def get_location(ip_address):
    try:
        response = requests.get(f'https://ipinfo.io/{ip_address}/json')
        data = response.json()
        city = data.get('city', 'N/A')
        country = data.get('country', 'N/A')
        region = data.get('region', 'N/A')
        loc = data.get('loc', 'N/A').split(',')
        latitude = loc[0] if len(loc) > 0 else 'N/A'
        longitude = loc[1] if len(loc) > 1 else 'N/A'
        return {
            "city": city,
            "country": country,
            "region": region,
            "latitude": latitude,
            "longitude": longitude
        }
    except Exception as e:
        print(f"Could not get location: {e}")
        return None

# 공공데이터 포털 미세먼지 농도 정보를 가져오는 함수
def get_air_quality(latitude, longitude, api_key):
    url = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty"
    params = {
        'serviceKey': api_key,
        'returnType': 'json',
        'numOfRows': 1,
        'pageNo': 1,
        'stationName': '종로구',  # 여기에 위치에 맞는 측정소 이름을 입력해야 합니다.
        'dataTerm': 'DAILY',
        'ver': '1.3'
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        if data['response']['header']['resultCode'] == '00':
            return data['response']['body']['items']
        else:
            print(f"Error in response: {data['response']['header']['resultMsg']}")
            return None
    except Exception as e:
        print(f"Could not get air quality data: {e}")
        return None

# 파이어베이스에 데이터 저장 함수
def save_to_firebase(data):
    ref = db.reference('air_quality')
    ref.push(data)

# 메인 함수
if __name__ == "__main__":
    # 공인 IP 주소를 가져옴
    ip_address = get_public_ip()
    print(ip_address)
    if ip_address:
        print(f"Public IP Address: {ip_address}")
        
        # 위치 정보를 가져옴
        location = get_location(ip_address)
        if location:
            print(f"City: {location['city']}")
            print(f"Country: {location['country']}")
            print(f"Region: {location['region']}")
            print(f"Latitude: {location['latitude']}")
            print(f"Longitude: {location['longitude']}")

            # 공공데이터 포털 API 키 설정
            api_key = 'K6tbYvbc8O7hHkU%2B5%2BsnEQ%2FVEz11413AnAhW3WWx17ARNH7U1SbH2da3AdS2KcXM4RWflTbOHYODHzGOiTEwHQ%3D%3D'
            
            # 미세먼지 농도 정보를 가져옴
            air_quality = get_air_quality(location['latitude'], location['longitude'], api_key)
            if air_quality:
                print(f"Air Quality Data: {air_quality}")

                # 파이어베이스 초기화
                initialize_firebase()

                # 파이어베이스에 데이터 저장
                data = {
                    'ip_address': ip_address,
                    'location': location,
                    'air_quality': air_quality
                }
                save_to_firebase(data)