 
import random
import time

max_v = 10  # que length threshold
max_wait = 60 # maximum waiting time for a vehicle

#priority sequence que_length, waiting_time , number of truck + bus

#_intializing ques

ques = {
    "que_A":{'idx':1, 'q_length': 12 , 'maximum_waiting_time' : 33, "truck_bus":0,"state":1},
    "que_B":{'idx':2,'q_length': 15, 'maximum_waiting_time' : 12, "truck_bus":0,"state":0},
    "que_C":{'idx':3,'q_length':7 , 'maximum_waiting_time' : 35, "truck_bus":0,"state":1},
    "que_D":{'idx':4,'q_length': 20 , 'maximum_waiting_time' : 46, "truck_bus":0,"state":0}
}

que_couples = {
    "que_A": "que_C",
    "que_B": "que_D",
    "que_C": "que_A",
    "que_D": "que_B",
}
def update_que(que, param,value):
    global ques
    ques[que][param] = value

def simulate_traffic(ques):
    for road_key, road in ques.items():
        if road["state"] == 1:  #red light On
            road["q_length"] += random.randint(1, 3)   
            road["maximum_waiting_time"] += random.randint(1, 3) 
            road["truck_bus"] += random.randint(0, 2)  
        else:   
            road["q_length"] -= random.randint(1, 3)   
            if road["q_length"] < 0:
                road["q_length"] = 0   
            road["maximum_waiting_time"] -= random.randint(1, 5)  
            if road["maximum_waiting_time"] < 0:
                road["maximum_waiting_time"] = 0   
            road["truck_bus"] -= random.randint(0, 3)   
            if road["truck_bus"] < 0:
                road["truck_bus"] = 0  
        ques[road_key]=road
    return ques

while True:
    ques = simulate_traffic(ques)
    print(ques)
 
    ques_names = list( ques.keys() )
    q_lengths = [data['q_length'] for data in ques.values()]
    waiting_times =  q_lengths = [data['q_length'] for data in ques.values()]
    truck_buses = q_lengths = [data['truck_bus'] for data in ques.values()]

    if any(value > max_v for value in q_lengths):
        is_full = [i+1 for i,v in enumerate(q_lengths)  if v>max_v ]
        print(is_full)
        if len(is_full) <=2 and (all(num % 2 != 0 for num in is_full) or all(num % 2 == 0 for num in is_full)):
            
            for i in is_full:
                print(ques_names[i-1])
                update_que(ques_names[i-1],"state", 1)
                update_que(que_couples[ques_names[i-1] ],"state", 1 )
                other_couple =  list(set(ques_names).difference(set([ques_names[i-1],que_couples[ques_names[i-1]] ])) )
                update_que(other_couple[0],"state", 0)
                update_que(other_couple[1],"state", 0 )

                                                
        elif len([value > max_wait for value in waiting_times]) >1: 
            idx = truck_buses.index(max(truck_buses))
            q_name = ques_names[idx]
            update_que(ques_names[idx] ,"state", 1 )
            update_que(que_couples[ques_names[idx] ],"state", 1 )
            other_couple =  list(set(ques_names).difference(set([ques_names[idx],que_couples[ques_names[idx]] ])))
            update_que(other_couple[0],"state", 0)
            update_que(other_couple[1],"state", 0 )

        else :
                    
            idx = waiting_times.index(max(waiting_times))
            q_name = ques_names[idx]
            update_que(ques_names[idx] ,"state", 1 )
            update_que(que_couples[ques_names[idx] ],"state", 1 )
            other_couple =  list(set(ques_names).difference(set([ques_names[idx],que_couples[ques_names[idx]] ])))
            update_que(other_couple[0],"state", 0)
            update_que(other_couple[1],"state", 0 )

    else:
        sorted_times = sorted(list(enumerate(waiting_times)) , key = lambda x : x[1] , reverse =True)
        que_idx = [i for i,j in sorted_times if ques[ques_names[i]]["state"]==0][0]
        update_que(ques_names[que_idx] ,"state", 1 )
        update_que(que_couples[ques_names[que_idx] ],"state", 1 )
        other_couple =  list(set(ques_names).difference(set([ques_names[que_idx],que_couples[ques_names[que_idx]] ])))
        update_que(other_couple[0],"state", 0)
        update_que(other_couple[1],"state", 0 )
    
    time.sleep(10)









        

