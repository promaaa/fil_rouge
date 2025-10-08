# Import libraries
import cv2 as cv

# Get video capture device
cam = cv.VideoCapture(0)

# Create cascade classifier for eye identification
stop_cascade = cv.CascadeClassifier("haardata/haarcascade_eye_tree_eyeglasses.xml")

# Get width and height of camera input
frame_width = int(cam.get(cv.CAP_PROP_FRAME_WIDTH))
frame_height = int(cam.get(cv.CAP_PROP_FRAME_HEIGHT))

# Main loop
while True:
    # Read one frame from the camera
    ret, frame = cam.read()

    # Identify desired objects
    frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    found = stop_cascade.detectMultiScale(frame_gray)
    for (x, y, w, h) in found:
        # Draw a rectangle over each of the identified objects
        cv.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 5)

    # Display the frame
    cv.imshow("camera", frame)

    # Read key, quit if ESC
    k = cv.waitKey(1)
    if k == 27:
        break

# Cleanup
cam.release()
cv.destroyAllWindows()