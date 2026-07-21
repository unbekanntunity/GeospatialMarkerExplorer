class MarkerNotFoundError(Exception):
    """MarkerNotFoundError raised for marker not found scenarios."""

    def __init__(self, id):
        super().__init__(f"Marker with id {id} not found.")