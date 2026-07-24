class FileTooLargeError(Exception):

    def __init__(self):
        super().__init__("Unsupported file type")