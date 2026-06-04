from app.repositories.UserRepository import UserRepository

class UserService:

    @staticmethod
    def get_all_users():
        return UserRepository.get_all()
