from marshmallow import Schema, fields

class UserRequest(Schema):
    name = fields.String(required=True)
    email = fields.Email(required=True)
