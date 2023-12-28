 
 const urls = [
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/2',
    'https://jsonplaceholder.typicode.com/todos/3',
  ];
 
 async function fetchDataFromUrls(urls) {
    const responseData = [];
    try {
      for (const url of urls) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();
        responseData.push(data);
      }
      return responseData;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }
  
  async function fetchData() {
    try {
      const data = await fetchDataFromUrls(urls);
      console.log('Data fetched successfully:', data);
      const newDataArray = data.map((item) => ({
        id: item.id,
        title: item.title,
        completed: item.completed,
      }));
  
      console.log('New Data Array:', newDataArray);
    } catch (error) {
      console.error('Error in fetching data:', error);
    }
  }
  

  
  module.exports = {
    fetchDataFromUrls,
    fetchData,
  };
  