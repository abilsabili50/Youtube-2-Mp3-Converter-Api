const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const url = process.env.API_URL;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.post("/", async (req, res) => {
	const { youtubeUrl } = req.body;
	let videoId;
	if (youtubeUrl.includes("youtube.com/watch?v=")) {
		videoId = youtubeUrl.split("v=")[1].split("&")[0];
	} else if (youtubeUrl.includes("youtu.be/")) {
		videoId = youtubeUrl.split("youtu.be/")[1];
	}
	const fetchApi = await fetch(url + videoId, {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": process.env.API_KEY,
			"X-RapidAPI-Host": process.env.API_HOST,
		},
	});

	if (!fetchApi)
		return res
			.status(400)
			.send({ status: "fail", message: "Error while converting the url" });

	const fetchResponse = await fetchApi.json();

	if (fetchResponse.status === "fail") {
		return res.status(404).send({ status: "fail", message: fetchResponse.msg });
	}

	return res.send({ status: "success", data: fetchResponse });
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
