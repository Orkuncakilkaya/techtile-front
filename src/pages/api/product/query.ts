import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const response = await fetch('http://165.22.88.161:5567/product').then(res => res.json());

    res.status(200).json(response.data);
}
