

export const saveAs = (blob, fileName) => {
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
  } else {
    navigator.msSaveBlob(blob, fileName);
  }
};

export const falsyFilter = (params: { [key: string]: any }) => {
  if (!params) return {};
  const res: any = {};
  Object.keys(params).forEach((e: string) => {
    if (
      params[e] !== ''
      && params[e] !== undefined
      && params[e] !== null
      && JSON.stringify(params[e]) !== '{}'
      && JSON.stringify(params[e]) !== '[]'
    ) {
      res[e] = params[e];
    }
  });
  return res;
};

// post请求下载文件
export const postDownloadFile = async ({ url, param, fileName, onSuccess, onFailed }: any) => {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'sys-code': localStorage.getItem('sys-code') || '',
    }, // resNotJson: true,
    body: JSON.stringify(falsyFilter(param)),
  })
    .then(
      response => new Response(
        new ReadableStream({
          start(controller) {
            const reader = response?.body?.getReader();

            function read() {
                reader
                  ?.read()
                  .then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }
                    controller.enqueue(value as Uint8Array);
                    read();
                  })
                  .catch(error => {
                    console.log(error);
                    controller.error(error);
                  });
            }

            read();
          },
        }),
      ),
    )
    .then(response => response.blob())
    .then(data => {
      saveAs(data, fileName);
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch(error => {
      console.log(error);
      if (onFailed) {
        onFailed();
      }
    });
};