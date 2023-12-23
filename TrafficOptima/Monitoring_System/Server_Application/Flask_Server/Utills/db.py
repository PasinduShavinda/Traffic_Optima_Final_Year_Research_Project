# from flask_pymongo import pymongo
import certifi
import pymongo

CONNECTION_STRING = "mongodb+srv://it20140298:NAH0YkCHykLzqsl7@rpcluster.ruexcgn.mongodb.net/?retryWrites=true&w=majority"

client = pymongo.MongoClient(CONNECTION_STRING, tlsCAFile=certifi.where())

db = client.get_database('TrafficOptima')

asd_collection = pymongo.collection.Collection(db, 'asdsevcollection')

emg_srv_collection = pymongo.collection.Collection(db, 'emgsrvcollection')
evp_logs_collection = pymongo.collection.Collection(db, 'evp_logs')

violations = pymongo.collection.Collection(db, 'violations')
users = pymongo.collection.Collection(db, 'users')
settings = pymongo.collection.Collection(db, 'settings')
organization = pymongo.collection.Collection(db, 'organization')


