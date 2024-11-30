from enum import Enum
from .control_utils import ControlUtils
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class State(Enum):
    S0 = 0
    S1 = 1
    S2 = 2 
    S3 = 3
    S4 = 4

class StateMachine:
    def __init__(self, node):
        self.state = State.S1
        self.qtSignalHandler = node.qtSignalHandler
        self.control_utils = node.control_utils
    
    def transition(self, side_temperature, top_temperature):
      old_state = self.state
      changed = True
      
      # 只要状态还在变化就继续转换
      while changed:
          changed = False
          if self.state == State.S0:
              self.state = State.S1
              changed = True
          if self.state == State.S1 and top_temperature > self.qtSignalHandler.temp_upper_limit:
              self.state = State.S2
              changed = True
          elif self.state == State.S2 and side_temperature > self.qtSignalHandler.temp_upper_limit:
              self.state = State.S3
              changed = True 
          elif self.state == State.S3 and side_temperature < self.qtSignalHandler.temp_lower_limit:
              self.state = State.S4
              changed = True
          elif self.state == State.S4 and top_temperature < self.qtSignalHandler.temp_upper_limit:
              self.state = State.S1
              changed = True
              
      # 返回是否发生过状态转换        
      return old_state != self.state
                
    def get_state(self):
        return self.state
        
    def run(self, side_temperature, top_temperature, humidity):
        self.qtSignalHandler.sensor_avg_data_updated.emit({
            "side_temperature": round(side_temperature, 1),
            "top_temperature": round(top_temperature, 1), 
            "humidity": round(humidity, 1)
        })
        if self.transition(side_temperature=side_temperature, top_temperature=top_temperature):
            logger.info(f"Transition successful! New state: {self.state}")
            self.qtSignalHandler.state_machine_updated.emit(self.state.value)
        if self.state == State.S1:
            result1 = self.control_utils.turn_left_steam_on()
            result2 = self.control_utils.turn_right_steam_on()
            if result1:
                self.qtSignalHandler.left_steam_status_updated.emit(True)
            if result2:
                self.qtSignalHandler.right_steam_status_updated.emit(True)

            result = self.control_utils.turn_spray_engine_off()
            if result:
                self.qtSignalHandler.spray_engine_status_updated.emit(False)
        elif self.state == State.S2:
            result1 = self.control_utils.turn_left_steam_off()
            result2 = self.control_utils.turn_right_steam_on()
            if result1:
                self.qtSignalHandler.left_steam_status_updated.emit(False)
            if result2:
                self.qtSignalHandler.right_steam_status_updated.emit(True)

            result = self.control_utils.turn_spray_engine_off()
            if result:
                self.qtSignalHandler.spray_engine_status_updated.emit(False)
        elif self.state == State.S3:
            result1 = self.control_utils.turn_left_steam_off()
            result2 = self.control_utils.turn_right_steam_off()
            if result1:
                self.qtSignalHandler.left_steam_status_updated.emit(False)
            if result2:
                self.qtSignalHandler.right_steam_status_updated.emit(False)

            if humidity < self.qtSignalHandler.humidity_lower_limit:
                result = self.control_utils.turn_spray_engine_on()
                if result:
                    self.qtSignalHandler.spray_engine_status_updated.emit(True)
            elif humidity > self.qtSignalHandler.humidity_upper_limit:
                result = self.control_utils.turn_spray_engine_off()
                if result:
                    self.qtSignalHandler.spray_engine_status_updated.emit(False)
            
        elif self.state == State.S4:
            result1 = self.control_utils.turn_left_steam_off()
            result2 = self.control_utils.turn_right_steam_on()
            if result1:
                self.qtSignalHandler.left_steam_status_updated.emit(False)
            if result2:
                self.qtSignalHandler.right_steam_status_updated.emit(True)

            result = self.control_utils.turn_spray_engine_off()
            if result:
                self.qtSignalHandler.spray_engine_status_updated.emit(False)
        