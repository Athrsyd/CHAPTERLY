from marshmallow import Schema, fields, validate


class RegisterRequest(Schema):
    name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=100),
        error_messages={"required": "Nama wajib diisi"}
    )
    email = fields.Email(
        required=True,
        error_messages={"required": "Email wajib diisi", "invalid": "Format email tidak valid"}
    )
    password = fields.String(
        required=True,
        validate=validate.Length(min=6),
        error_messages={"required": "Password wajib diisi"}
    )


class LoginRequest(Schema):
    email = fields.Email(
        required=True,
        error_messages={"required": "Email wajib diisi"}
    )
    password = fields.String(
        required=True,
        error_messages={"required": "Password wajib diisi"}
    )
