import numpy as np
import time
from detection import counts


RED = 'red'
GREEN = 'green'


def get_vehicle_counts():
    e, f, g, h = counts()
    vehicle_counts = {
        'TE': e,
        'TS': f,
        'TW': g,
        'TN': h,
    }
    return vehicle_counts


def calculate_next_states(vehicle_counts, q_tables, epsilon):
    next_states = {}
    for direction in vehicle_counts:
        if np.random.random() < epsilon:
        
            next_states[direction] = np.random.choice([RED, GREEN])
        else:
            
            q_table = q_tables[direction]
            if q_table[RED] > q_table[GREEN]:
                next_states[direction] = RED
            else:
                next_states[direction] = GREEN
    return next_states

def update_q_values(q_tables, prev_states, actions, rewards, next_states, learning_rate, discount_factor):
    for direction in prev_states:
        prev_state = prev_states[direction]
        action = actions[direction]
        reward = rewards[direction]
        next_state = next_states[direction]

        q_table = q_tables[direction]
        q_table[prev_state] = (1 - learning_rate) * q_table[prev_state] + learning_rate * (reward + discount_factor * max(q_table[next_state], q_table[action]))


def control_traffic_lights():
   
    q_tables = {
        'TE': {RED: 0, GREEN: 0},
        'TS': {RED: 0, GREEN: 0},
        'TW': {RED: 0, GREEN: 0},
        'TN': {RED: 0, GREEN: 0},
    }

    epsilon = 0.3 
    learning_rate = 0.1
    discount_factor = 0.9

    while True:
        try:
    
            vehicle_counts = get_vehicle_counts()

            
            current_states = {}
            for direction in vehicle_counts:
                q_table = q_tables[direction]
                if q_table[RED] > q_table[GREEN]:
                    current_states[direction] = RED
                else:
                    current_states[direction] = GREEN

        
            actions = current_states.copy()

            green_light_duration = 5

            
            rewards = {direction: 1 if vehicle_counts[direction] < 10 else -1 for direction in vehicle_counts}

            
            next_states = calculate_next_states(vehicle_counts, q_tables, epsilon)

            update_q_values(q_tables, current_states, actions, rewards, next_states, learning_rate, discount_factor)

            for direction in actions:
                action = actions[direction]
                print(f"{direction} - {action.capitalize()}")
               
            
            time.sleep(1)

        except KeyboardInterrupt:
            
            break

if __name__ == "__main__":
    control_traffic_lights()
