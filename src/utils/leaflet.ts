const API_KEY = process.env.NEXT_PUBLIC_MAP_API;

export default {
    maptiler: {
        url: `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${API_KEY}`,
        attribution: "<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>"
    }
}