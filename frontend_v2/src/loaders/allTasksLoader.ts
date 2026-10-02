export async function loader() {
    const data = await fetch('http://localhost:3000/api/tasks');
    const tasks = await data.json();
    return tasks.data;
}