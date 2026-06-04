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
