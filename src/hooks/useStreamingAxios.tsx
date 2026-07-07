import { useState, useCallback } from 'react';

export interface DataResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export const useStreamingAxios = <T = any>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStream = useCallback(async (url: string, onData?: (data: any) => void) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}${url}`;
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setIsLoading(false);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            
            if (dataStr.trim()) {
              try {
                const parsedData = JSON.parse(dataStr);
                
                // Call custom callback for real-time updates
                if (onData) {
                  onData(parsedData);
                }
                
                // Update state for successful responses
                if (parsedData.success && parsedData.data) {
                  setData(parsedData.data);
                }
              } catch (e) {
                console.error('Error parsing streaming JSON:', e);
              }
            }
          }
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  return { 
    fetchStream, 
    isLoading, 
    data, 
    error 
  };
};