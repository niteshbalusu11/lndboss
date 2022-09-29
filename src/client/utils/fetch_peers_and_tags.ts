import * as types from '~shared/types';

import { axiosGetNoLoading } from './axios';

const fetchPeersAndTags = async ({}) => {
  const list = [];
  const tagsQuery: types.commandTags = {
    icon: '',
    add: '',
    id: '',
    is_avoided: false,
    remove: '',
    tag: '',
  };

  const [responsePeers, responseTags] = await Promise.all([
    axiosGetNoLoading({ path: 'grpc/get-peers-all-nodes', query: {} }),
    axiosGetNoLoading({ path: 'tags', query: tagsQuery }),
  ]);

  if (!!responsePeers) {
    responsePeers.forEach(peers => {
      peers.result.forEach(p => {
        list.push(`${p.alias}\n${p.public_key}\nNode: ${peers.node}`);
      });
    });

    if (!!responseTags) {
      responseTags.forEach(tag => {
        list.push(`Tag: \n${tag.alias}`);
      });
    }

    return { list };
  }
};

export default fetchPeersAndTags;
