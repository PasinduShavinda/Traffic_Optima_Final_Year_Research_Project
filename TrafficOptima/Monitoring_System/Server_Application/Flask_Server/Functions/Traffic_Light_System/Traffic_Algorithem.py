"""
------------------------------------------------------------------------------
 File: Traffic_Algorithem.py
 Purpose: This file contains the traffic light system Algoritem
 Author: IT20137700
 Date: 2023-10-30
------------------------------------------------------------------------------
"""

import numpy as np
import time
import random
from TrafficOptima.Monitoring_System.Server_Application.Flask_Server.Functions.Traffic_Light_System.Generate_Frames import my_dict
RED = 'red'
GREEN = 'green'
signal = [1, 0]

signal = dict(zip(signal, (RED, GREEN)))
emergency_weight = -5
bus_weight = -3
refresh_duration = 3


groups = {
    'up': 1,
    'down': 1,
    'right': 2,
    'left': 2,
}


def get_vehicle_count():
    random_add = [random.randint(0, 13) for i in range(4)]
    emergency_add = [0, 0, 0, 0]
    busses = [0, 0, 0, 0]
    dirs = ["up", "down", "right", "left"]
    emergency_decider = random.randint(1, 100)
    bus_decider = random.randint(1, 100)
    emer_threshold = 20
    bus_treshold = 40
    if emergency_decider <= emer_threshold:
        direc = random.choice(dirs)
        emergency_add[dirs.index(direc)] = 1
    if bus_decider < bus_treshold:
        direc = random.choice(dirs)
        busses[dirs.index(direc)] = random.randint(1, 3)

    # vehicle_counts = dict(zip(dirs, zip(random_add, emergency_add, busses)))
    vehicle_counts = {
            "up": (my_dict["lane1"], 0, my_dict["lane1_Bus"]),
            "down": (my_dict["lane2"], 0, my_dict["lane2_Bus"]),
            "right": (my_dict["lane3"], 0, my_dict["lane3_Bus"]),
            "left": (my_dict["lane4"], 0, my_dict["lane4_Bus"])
        }
    return vehicle_counts


def waiting_time(vehicle_count, current_states):
    # red_dict = {key :value for key, value in current_states.items() if value == RED}
    total_time = 0
    total_vehicle = 0
    for direction in vehicle_count.keys():

        n_vehicles = vehicle_count[direction][0]
        total_vehicle = total_vehicle + n_vehicles
        # check whether stopped
        if current_states[direction] == RED:
            blocked_v = vehicle_count[direction][0]
            time = refresh_duration * blocked_v
            total_time = total_time + time
    return total_vehicle, total_time


def generator(directions):
    dict_items = list(directions.items())

    random.shuffle(dict_items)

    directions = dict(dict_items)

    key_1 = list(directions.keys())[0]
    key_2 = list(directions.keys())[1]
    key_3 = list(directions.keys())[2]
    key_4 = list(directions.keys())[3]

    if groups[key_1] == groups[key_2]:
        directions[key_1] = 0
        directions[key_2] = 0
        directions[key_3] = 1
        directions[key_4] = 1
    else:
        directions[key_1] = 0
        directions[key_2] = 1
        directions[key_3] = 1
        directions[key_4] = 1

    return directions


def calculate_next_states(q_tables, groups):
    next_states = {}

    sorted_q_tables = dict(sorted(q_tables.items(), key=lambda x: x[1][GREEN], reverse=True))
    keys = list(sorted_q_tables.keys())
    max_green = keys[0]
    next_green = keys[1]

    next_states[max_green] = GREEN

    if groups[max_green] == groups[next_green]:
        next_states[next_green] = GREEN
    else:
        next_states[next_green] = RED

    next_states[keys[2]] = RED
    next_states[keys[3]] = RED

    next_states = {key: next_states[key] for key in q_tables.keys()}

    return next_states


def update_q_values(q_tables, prev_states, actions, rewards, next_states, learning_rate, discount_factor):
    for direction in prev_states:
        prev_state = prev_states[direction]
        action = actions[direction]
        reward = rewards[direction]
        next_state = next_states[direction]

        q_table = q_tables[direction]

        # Q-learning algorithm
        q_table[prev_state] = (1 - learning_rate) * q_table[prev_state] + learning_rate * (
                    reward + discount_factor * max(q_table[next_state], q_table[action]))


def count_update(vehicle_que):
    state = {}

    s_que = dict(sorted(vehicle_que.items(), key=lambda x: x[1][1], reverse=True))
    s_que_ = dict(sorted(vehicle_que.items(), key=lambda x: x[1][2], reverse=True))

    if list(s_que.values())[0][1] > 0:
        sorted_que = list(s_que.keys())
    else:

        temp_que = {key: (val[0] + (-1) * (bus_weight) * (val[2]), val[1], val[2]) for key, val in vehicle_que.items()}
        sorted_que = list(dict(sorted(temp_que.items(), key=lambda x: x[1][0], reverse=True)).keys())

    max_key = sorted_que[0]
    second_max = sorted_que[1]

    state[max_key] = GREEN

    if groups[max_key] == groups[second_max]:

        state[sorted_que[1]] = GREEN
    else:
        state[sorted_que[1]] = RED

    state[sorted_que[2]] = RED
    state[sorted_que[3]] = RED

    state = {key: state[key] for key in vehicle_que.keys()}

    return state


def control_traffic_lights():
    q_tables = {
        'up': {RED: 0, GREEN: 0},
        'down': {RED: 0, GREEN: 0},
        'right': {RED: 0, GREEN: 0},
        'left': {RED: 0, GREEN: 0},
    }

    n_vehicles = 0
    n_time = 0
    learning_rate = 0.05
    discount_factor = 0.75

    while True:

        try:

            current_states = {}  # initialize state
            # sorting Q_table values . Descending order
            sorted_q_tables = dict(sorted(q_tables.items(), key=lambda x: x[1][GREEN], reverse=True))
            keys = list(sorted_q_tables.keys())

            # highest direction
            max_green = keys[0]
            next_green = keys[1]

            current_states[max_green] = GREEN

            # check oposit direction
            if groups[max_green] == groups[next_green]:
                current_states[next_green] = GREEN
            else:
                current_states[next_green] = RED

            current_states[keys[2]] = RED
            current_states[keys[3]] = RED

            # reordering
            current_states = {key: current_states[key] for key in q_tables.keys()}

            # current state
            actions = current_states.copy()

            vehicle_counts = get_vehicle_count()
            print(vehicle_counts)
            action_ = count_update(vehicle_counts)

            # rewards = {direction: 1 if vehicle_counts[direction] < 10 else -1 for direction in vehicle_counts}

            # updating q values
            rewards = {}
            for dir in vehicle_counts.keys():
                normal = vehicle_counts[dir][0]
                emergence = vehicle_counts[dir][1]
                buss = vehicle_counts[dir][2]
                if normal < 3:
                    reward = 1.5
                elif normal >= 3 and normal < 8:
                    reward = -1
                elif normal >= 8:
                    reward = -1.5
                reward += emergence * emergency_weight + bus_weight * buss
                rewards[dir] = reward

            next_states = calculate_next_states(q_tables, groups)

            # find optimum q values
            update_q_values(q_tables, current_states, actions, rewards, next_states, learning_rate, discount_factor)

            t_vehicle, t_time = waiting_time(vehicle_counts, current_states)
            n_vehicles += t_vehicle
            n_time += t_time

            for direction in actions:
                action = actions[direction]
                # print(f"{direction} - {action.capitalize()}")
            print(action_)
            yield action_
            print(
                '------------------------------------------------------------------------------------------------------------------')
            time.sleep(refresh_duration)

        except KeyboardInterrupt:

            print(f'\naverage waiting time: {t_vehicle / t_time} seconds')
            break


if __name__ == "__main__":
    control_traffic_lights()
