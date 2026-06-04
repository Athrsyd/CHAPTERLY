from config.supabase import supabase

def run():
    supabase.table("Users").insert({
        "name":"Admin",
        "email":"admin@example.com",
        'password':'admin123'
    }).execute()
