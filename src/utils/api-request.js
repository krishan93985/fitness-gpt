export const apiRequest = async (requestUrl, requestOptions, onSuccess = () => null, onFailure = () => null) => {
      try {
        let response = await fetch(
          requestUrl,
          requestOptions
        );
    
        let parsedResponse = await response.json();

        if (response.ok)
          return await onSuccess(parsedResponse);
        else
          throw parsedResponse;

      } catch (error) {
        console.log({error})
        await onFailure(error)
      }
}