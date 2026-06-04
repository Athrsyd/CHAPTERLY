from config.supabase import supabase


class UserRepository:

    @staticmethod
    def get_all():
        return (
            supabase
            .table("Users")
            .select("*")
            .execute()
            .data
        )

    @staticmethod
    def find_by_email(email: str):
        result = (
            supabase
            .table("Users")
            .select("*")
            .eq("email", email)
            .execute()
        )
        data = result.data
        return data[0] if data else None

    @staticmethod
    def find_by_id(user_id: str):
        result = (
            supabase
            .table("Users")
            .select("id, name, email, created_at")
            .eq("id", user_id)
            .execute()
        )
        data = result.data
        return data[0] if data else None

    @staticmethod
    def create(name: str, email: str, hashed_password: str):
        result = (
            supabase
            .table("Users")
            .insert({
                "name": name,
                "email": email,
                "password": hashed_password
            })
            .select()
            .execute()
        )
        return result.data[0] if result.data else None