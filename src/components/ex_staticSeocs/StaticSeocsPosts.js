import React from 'react'

const StaticSeocsPosts = ({ posts, loading }) => {
    if (loading) {
        return <h2>loading....</h2>;
    }
    return (
        <div class='container'>
        <table class='table table-striped'>
            <tr>
                <th>Service Line</th>
                <th>SEOC</th>
                <th>Version</th>
                <th>Effective</th>
                <th>End Date</th>
            </tr>
            <tbody>
            {posts.map(post => (
                <tr key={[post.id]}>
                    <td className=''>{post.serviceLine}</td>
                    <td className=''>{post.name}</td>
                    <td className='text-nowrap'>{post.versionNumber}</td>
                    <td className='text-nowrap'>{post.effectiveDate}</td>
                    <td className='text-nowrap'>{post.endDate}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    )
}

export default StaticSeocsPosts;
