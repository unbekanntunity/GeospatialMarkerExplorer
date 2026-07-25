class FileTooLargeError(Exception):

    def __init__(self):
        super().__init__("File too large.")