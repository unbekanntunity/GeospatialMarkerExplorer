class SectionNotFoundError(Exception):
    
    def __init__(self, id):
        super().__init__(f"Section with id {id} not found.")