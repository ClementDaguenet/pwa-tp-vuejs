<template>
  <div class="media-capture">
    <!-- Camera frame -->
    <video ref="video" autoplay></video>
    <!-- Un/active camera button -->
    <button @click="toggleCamera" class="btn-trans-purple">
      {{
        isCameraActive
          ? $t("lang.camera_deactivateCamera")
          : $t("lang.camera_activateCamera")
      }}
    </button>
    <div v-if="photoData.length > 0" class="carousel">
      <!-- Arrow < -->
      <button @click="previousPhoto" class="carousel-btn prev-btn">
        &#10094;
      </button>
      <!-- Carousel Image-->
      <img :src="photoData[photoIndex]" class="carousel-img" />
      <!-- Arrow > -->
      <button @click="nextPhoto" class="carousel-btn next-btn">
        &#10095;
      </button>
    </div>
    <!-- Take a photo button -->
    <button v-if="isCameraActive" @click="takePhoto" class="btn-trans-purple">
      {{ $t("lang.camera_takePhoto") }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "CameraUser",
  setup() {
    const { t } = useI18n();
    const video = ref<HTMLVideoElement | null>(null); // Where can be stock the camera track
    const isCameraActive = ref(false); // Activity of the camera
    const photoData = ref<string[]>([]); // Array for photo storage
    const photoIndex = ref(0); // Photo index
    let stream: MediaStream | null = null;

    // Function to start the camera capture in the video component
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (video.value) {
          video.value.srcObject = stream;
        }
        isCameraActive.value = true;
      } catch {
        alert(t("lang.camera_cameraAccessDenied"));
      }
    };

    // Function to stop the camera
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
      isCameraActive.value = false;
    };

    // Function to change camera activity
    const toggleCamera = () => {
      if (isCameraActive.value) {
        stopCamera();
      } else {
        startCamera();
      }
    };

    // Function to compress image because after 20 images, localStorage crash
    const compressImage = (canvas: HTMLCanvasElement): string => {
      return canvas.toDataURL("image/jpeg", 0.7); // Compresser avec une qualité de 70%
    };

    // Function to verify localStorage size to avoid max storage bug
    const checkStorageAndAddPhoto = (newPhoto: string) => {
      // Charge photos that are already in the localStorage
      const storedPhotos = localStorage.getItem("capturedPhotos");
      const currentPhotos = storedPhotos ? JSON.parse(storedPhotos) : [];
      currentPhotos.push(newPhoto); // Add new taked photo
      if (currentPhotos.length > 5) {
        const oldestPhoto = currentPhotos.shift(); // Delete oldest photo if +10 photos in localStorage
        localStorage.removeItem("capturedPhotos");
      }
      localStorage.setItem("capturedPhotos", JSON.stringify(currentPhotos));
      photoData.value = currentPhotos; // Update photos array
      photoIndex.value = currentPhotos.length - 1; // Update photos index
    };

    // Function to take photo of the actual camera
    const takePhoto = () => {
      if (video.value) {
        const canvas = document.createElement("canvas"); // Take the DOM canvas
        const canvasContext = canvas.getContext("2d"); // Give it a context
        if (canvasContext) {
          // Update its size
          canvas.width = video.value.videoWidth;
          canvas.height = video.value.videoHeight;
          // Add taked photos in the canvas context
          canvasContext.drawImage(
            video.value,
            0,
            0,
            canvas.width,
            canvas.height
          );
          const compressedImage = compressImage(canvas);
          checkStorageAndAddPhoto(compressedImage);

          if (Notification.permission === "granted") {
            navigator.serviceWorker.ready.then(function (registration) {
              registration.showNotification(t("lang.camera_photoTaken"), {
                body: t("lang.camera_photoSaved"),
              });
            });
          } else {
            new Notification(t("lang.camera_photoTaken"), {
              body: t("lang.camera_photoSaved"),
              icon: compressedImage,
            });
          }
        }
      }
    };

    // Function to see the previous photo of the localStorage in the carousel
    const previousPhoto = () => {
      photoIndex.value =
        (photoIndex.value - 1 + photoData.value.length) %
        photoData.value.length;
    };

    // Function to see the next photo of the localStorage in the carousel
    const nextPhoto = () => {
      photoIndex.value = (photoIndex.value + 1) % photoData.value.length;
    };

    // Function to recover photos stored when mounting the component
    onMounted(() => {
      const savedPhotos = localStorage.getItem("capturedPhotos");
      if (savedPhotos) {
        photoData.value = JSON.parse(savedPhotos);
      }
    });

    return {
      video,
      isCameraActive,
      toggleCamera,
      takePhoto,
      photoData,
      previousPhoto,
      nextPhoto,
      photoIndex,
    };
  },
});
</script>

<style scoped>
.media-capture {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

video {
  width: 100%;
  max-width: 400px;
  border: 2px solid #ccc;
  transform: scaleX(-1);
}

.btn-trans-purple {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #b142b9;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-trans-purple:hover {
  background-color: #812688;
  transform: scale(1.05);
}

.btn-trans-purple::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
}

.btn-trans-purple:active::after {
  width: 200px;
  height: 200px;
  opacity: 0;
}

.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  position: relative;
}

.carousel-img {
  max-width: 300px;
  max-height: 300px;
  border: 2px solid #ccc;
  margin: 0 10px;
  transform: scaleX(-1);
}

.carousel-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.prev-btn {
  left: 10px;
  z-index: 1;
}

.next-btn {
  right: 10px;
}

.carousel-btn:hover {
  background-color: #812688;
}

.carousel-btn:focus {
  outline: none;
}
</style>
