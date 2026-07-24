class CategoryNotFoundError(Exception):

    def __init__(self, id):
        super().__init__(f"Category with id {id} not found.")