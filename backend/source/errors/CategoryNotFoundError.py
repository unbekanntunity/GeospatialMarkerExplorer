class CategoryNotFoundError(Exception):
    """CategoryNotFoundError raised for marker not found scenarios."""

    def __init__(self, id):
        super().__init__(f"Category with id {id} not found.")