from flask import jsonify


def success(data=None, message="Success", status=200):
    """Return a standardised success response."""
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status


def error(message="An error occurred", status=400):
    """Return a standardised error response."""
    return jsonify({"success": False, "message": message}), status
