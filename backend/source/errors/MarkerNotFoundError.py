class MarkerNotFoundError(Exception):
    
    def __init__(self, id):
        super().__init__(f"Marker with id {id} not found.")