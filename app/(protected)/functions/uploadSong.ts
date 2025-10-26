export async function uploadSong(formData: FormData) {
    const res = await fetch("/api/songs", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error || "Failed to upload song");
    }

    const result = await res.json();
    console.log("Upload result:", result);
    return result;
}
