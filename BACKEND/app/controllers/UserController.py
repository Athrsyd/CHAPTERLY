from app.services.UserService import UserService

def index():
    return UserService.get_all_users()
